import React, { createContext, useContext, useState, useEffect } from 'react';

const SprintContext = createContext();

export const useSprint = () => useContext(SprintContext);

const BACKEND_URL = "https://sprint-intell-backend.onrender.com";

export const SprintProvider = ({ children }) => {
  const [sprintData, setSprintData] = useState({
    healthScore: 100,
    scenarioName: "Loading Data",
    scenarioDescription: "",
    metrics: {
      blockedTasks: 0,
      openPRs: 0,
      stalePRs: 0,
      staleTasks: 0,
      activeIncidents: 0,
      overloadedEngineers: 0,
      donePoints: 0,
      totalPoints: 0,
      velocity: 0
    },
    issues: [],
    prs: [],
    team: [],
    timeline: [],
    blockers: [],
    slackLogs: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [standupText, setStandupText] = useState("");
  const [standupLoading, setStandupLoading] = useState(false);
  const [slackUsers, setSlackUsers] = useState([]);

  // Dynamic status states to prevent re-fetching assets unnecessarily
  const [loadedViews, setLoadedViews] = useState({
    overview: false,
    issues: false,
    prs: false,
    team: false,
    timeline: false,
    blockers: false,
    slackLogs: false
  });

  // Base loader helper
  const loadResource = async (type, endpoint) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/sprint/${endpoint}`);
      if (!response.ok) throw new Error(`Failed to load ${type}`);
      const data = await response.json();
      
      setSprintData(prev => {
        if (type === 'overview') {
          return {
            ...prev,
            healthScore: data.healthScore,
            scenarioName: data.scenarioName,
            scenarioDescription: data.scenarioDescription,
            metrics: data.metrics
          };
        }
        return {
          ...prev,
          [type]: data
        };
      });
      
      setLoadedViews(prev => ({ ...prev, [type]: true }));
    } catch (err) {
      console.error(`Error loading resource ${type}:`, err.message);
      setError(`Sprint Intelligence API connection failed for endpoint: ${endpoint}`);
    }
  };

  // On-demand loader functions called selectively by components on mount
  const fetchOverviewData = async (force = false) => {
    if (loadedViews.overview && !force) return;
    setLoading(true);
    await loadResource('overview', 'overview');
    setLoading(false);
  };

  const fetchIssuesData = async (force = false) => {
    if (loadedViews.issues && !force) return;
    setLoading(true);
    await loadResource('issues', 'issues');
    // Lazy pull-requests load since it projects into issues or metrics
    await loadResource('prs', 'pull-requests');
    setLoading(false);
  };

  const fetchSlackLogsData = async (force = false) => {
    if (loadedViews.slackLogs && !force) return;
    setLoading(true);
    try {
      // 1. Resolve 'sprint-1-dev' channel name to its unique ID
      const channelRes = await fetch(`${BACKEND_URL}/api/coral/sql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "SELECT id FROM slack.channels WHERE name = 'sprint-1-dev' LIMIT 1" })
      });
      
      let channelId = null;
      if (channelRes.ok) {
        const channelData = await channelRes.json();
        if (channelData.rows && channelData.rows.length > 0) {
          channelId = channelData.rows[0].id;
        }
      }

      if (!channelId) {
        console.warn("[Sprint Context] 'sprint-1-dev' channel ID not found, using raw query fallback.");
      }

      // 2. Load slack users first if not loaded in memory to ensure ID resolution works 100%
      let activeUsers = [...slackUsers];
      if (activeUsers.length === 0) {
        const slackRes = await fetch(`${BACKEND_URL}/api/coral/sql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "SELECT id, name, real_name, display_name, email FROM slack.users" })
        });
        if (slackRes.ok) {
          const usersData = await slackRes.json();
          activeUsers = usersData.rows || [];
          setSlackUsers(activeUsers);
        }
      }

      // 3. Query Coral's parameterized slack.messages function using the resolved ID
      const slackQuery = channelId 
        ? `SELECT '${channelId}' AS channel, m.user_id AS sender, m.text AS message, m.ts AS timestamp FROM slack.messages(channel => '${channelId}') m ORDER BY m.ts DESC LIMIT 30`
        : `SELECT channel, sender, message, timestamp FROM slack.messages LIMIT 10`; // Fallback projection

      const response = await fetch(`${BACKEND_URL}/api/coral/sql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: slackQuery })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Resolve user display handles
        const resolvedLogs = (result.rows || []).map(log => {
          const user = activeUsers.find(u => u.id === log.sender);
          const handle = user ? `@${user.real_name || user.display_name || user.name}` : log.sender || "@unknown";
          
          // Parse Slack float ts string to ISO Date if available
          let parsedTime = log.timestamp;
          if (log.timestamp && !isNaN(log.timestamp)) {
            parsedTime = new Date(parseFloat(log.timestamp) * 1000).toISOString();
          }

          return {
            channel: "#sprint-1-dev",
            sender: handle,
            message: resolveSlackMentions(log.message || log.text || "", activeUsers),
            timestamp: parsedTime || new Date().toISOString()
          };
        });

        setSprintData(prev => ({
          ...prev,
          slackLogs: resolvedLogs
        }));
        setLoadedViews(prev => ({ ...prev, slackLogs: true }));
      }
    } catch (err) {
      console.error("Failed to load slack logs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamData = async (force = false) => {
    if (loadedViews.team && !force) return;
    setLoading(true);
    await loadResource('team', 'team');
    setLoading(false);
  };

  const fetchTimelineData = async (force = false) => {
    if (loadedViews.timeline && !force) return;
    setLoading(true);
    await loadResource('timeline', 'timeline');
    setLoading(false);
  };

  const fetchBlockersData = async (force = false) => {
    if (loadedViews.blockers && !force) return;
    setLoading(true);
    await loadResource('blockers', 'blockers');
    setLoading(false);
  };

  // Global initializers (Overview metrics + Slack users for chat matching)
  const initializeWorkspace = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch core overview data first
      await loadResource('overview', 'overview');
      
      // Load slack users for chat context matching
      const slackRes = await fetch(`${BACKEND_URL}/api/coral/sql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "SELECT id, name, real_name, display_name, email FROM slack.users" })
      });
      if (slackRes.ok) {
        const usersData = await slackRes.json();
        setSlackUsers(usersData.rows || []);
      }
    } catch (err) {
      console.error("Workspace init failed:", err.message);
      setError("Failed to initialize active Coral workspace connection. Verify port 5001 backend service status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeWorkspace();
  }, []);

  const resolveSlackMentions = (text, customUsers = null) => {
    if (!text) return "";
    let resolvedText = text;
    const usersList = customUsers || slackUsers;
    
    // Replace <@U12345> style mentions
    const userMentionRegex = /<@([A-Z0-9]+)>/g;
    resolvedText = resolvedText.replace(userMentionRegex, (match, userId) => {
      const user = usersList.find(u => u.id === userId);
      return user ? `@${user.real_name || user.display_name || user.name}` : `@${userId}`;
    });

    // Replace raw @U12345 style mentions
    const rawMentionRegex = /@([A-Z0-9]{8,12})/g;
    resolvedText = resolvedText.replace(rawMentionRegex, (match, userId) => {
      const user = usersList.find(u => u.id === userId);
      return user ? `@${user.real_name || user.display_name || user.name}` : `@${userId}`;
    });

    return resolvedText;
  };

  const askAIChat = async (userQuery) => {
    setChatLoading(true);
    const userMsg = { id: Date.now(), sender: "user", text: userQuery, time: new Date() };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery })
      });

      if (!response.ok) throw new Error("AI query failed");

      const data = await response.json();
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.answer,
        mode: data.mode || "Live Coral retrival mode",
        citations: data.retrievedDocs || [],
        time: new Date()
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn("Backend AI chat error:", err.message);
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "ai",
        text: `Something went wrong while processing the query. Please try again later.`,
        mode: "Offline Warning Mode",
        citations: [],
        time: new Date()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const triggerStandupGeneration = async () => {
    setStandupLoading(true);
    setStandupText("");
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/standup`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Standup trigger failed");
      const data = await response.json();
      setStandupText(data.answer);
    } catch (err) {
      console.error("Backend standup generator failed:", err.message);
      setStandupText("### ⚠️ Connection Error\n\nFailed to generate the daily standup script because the backend Express server was unreachable.");
    } finally {
      setStandupLoading(false);
    }
  };

  const executeCoralSql = async (sqlQuery) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/coral/sql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlQuery })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "SQL query failed");
      }
      return await response.json();
    } catch (err) {
      console.error("SQL query failed:", err.message);
      throw new Error(err.message || "Failed to communicate with Coral SQL executor.");
    }
  };

  return (
    <SprintContext.Provider value={{
      sprintData,
      loading,
      error,
      chatMessages,
      chatLoading,
      standupText,
      standupLoading,
      slackUsers,
      resolveSlackMentions,
      fetchOverviewData,
      fetchIssuesData,
      fetchSlackLogsData,
      fetchTeamData,
      fetchTimelineData,
      fetchBlockersData,
      askAIChat,
      triggerStandupGeneration,
      setChatMessages,
      executeCoralSql
    }}>
      {children}
    </SprintContext.Provider>
  );
};
