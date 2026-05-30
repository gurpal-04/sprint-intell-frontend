import React, { createContext, useContext, useState, useEffect } from 'react';

const SprintContext = createContext();

export const useSprint = () => useContext(SprintContext);

const BACKEND_URL = "http://localhost:5001"; // Ensure this matches your backend server URL and port

export const SprintProvider = ({ children }) => {
  const [sprintData, setSprintData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [standupText, setStandupText] = useState("");
  const [standupLoading, setStandupLoading] = useState(false);
  const [slackUsers, setSlackUsers] = useState([]);

  const fetchSprintData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all sprint metrics, issues, pull requests, team allocations, timeline, blockers and slack users consolidated
      const response = await fetch(`${BACKEND_URL}/api/sprint/bootstrap`);

      if (!response.ok) {
        throw new Error("Failed to connect to backend Sprint Intelligence bootstrap endpoint.");
      }

      const data = await response.json();

      if (data.slackUsers) {
        setSlackUsers(data.slackUsers);
      }

      setSprintData({
        healthScore: data.overview.healthScore,
        scenarioName: data.overview.scenarioName,
        scenarioDescription: data.overview.scenarioDescription,
        metrics: data.overview.metrics,
        issues: data.issues || [],
        prs: data.prs || [],
        team: data.team || [],
        timeline: data.timeline || [],
        blockers: data.blockers || []
      });
    } catch (err) {
      console.error("Backend server connection failed:", err.message);
      setError("Sprint Intelligence Express API connection failed. Ensure the server is running on port 5001 and your local Coral CLI is connected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprintData();
  }, []);

  const resolveSlackMentions = (text) => {
    if (!text) return "";
    let resolvedText = text;
    
    // Replace <@U12345> style mentions
    const userMentionRegex = /<@([A-Z0-9]+)>/g;
    resolvedText = resolvedText.replace(userMentionRegex, (match, userId) => {
      const user = slackUsers.find(u => u.id === userId);
      return user ? `@${user.real_name || user.display_name || user.name}` : `@${userId}`;
    });

    // Replace raw @U12345 style mentions
    const rawMentionRegex = /@([A-Z0-9]{8,12})/g;
    resolvedText = resolvedText.replace(rawMentionRegex, (match, userId) => {
      const user = slackUsers.find(u => u.id === userId);
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
        text: `### ⚠️ Connection Error\n\nI was unable to communicate with the Sprint Operations AI orchestrator. Please check if the Express backend server is running locally on port 5001.`,
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
      fetchSprintData,
      askAIChat,
      triggerStandupGeneration,
      setChatMessages,
      executeCoralSql
    }}>
      {children}
    </SprintContext.Provider>
  );
};
