import ChatBot from 'react-chatbotify';

const MyChatBot = () => {
  const flow = {
    start: {
      message: 'Hello! Ask your agent anything.',
      path: 'process_query',
    },
    process_query: {
      message: async (params) => {
        const userPrompt = params.userInput;
        let fullResponseText = '';

        try {
          // Send request to the Node.js agent stream endpoint
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/agent-stream`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: userPrompt }),
            },
          );

          if (!response.body)
            throw new Error('No response body data available');
          //console.log(response.body);
          // Read incoming stream chunks
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8'); // Handles multi-byte splits

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

                        // Decode chunk byte array to text string
                        const rawChunk = decoder.decode(value, { stream: true });
                        const lines = rawChunk.split('\n');
                        
                        for (const line of lines) {
                            //console.log(line);
                            //if (line.startsWith('data:')) {
                                //console.log(line);
                                try {
                                    //console.log(line.slice(5));
                                    //const parsed = line.slice(6)
                                    //console.log(parsed);
                                    //if (parsed.text) {
                                        fullResponseText += line ;
                                        //console.log(fullResponseText);
                                        // Update ChatBotify UI in real-time
                                        sessionStorage.removeItem("rcb-history");
                                        localStorage.removeItem("rcb-history");
                                        await params.injectMessage(fullResponseText);
                                    //}
                                } catch (e) {
                                    // Handle parsing edges or incomplete data chunks smoothly
                                    await params.injectMessage("Sorry, I am having trouble giving result.");
                                    console.error("Stream error:", error);
                                }
                            }
                        //}
                    }
                } catch (error) {
                    await params.streamMessage("Sorry, I am having trouble reaching the agent.");
                    console.error("Stream error:", error);
                }
                
                // Return path to cycle back for next user input
                return "ask anything";
            },
            path: "process_query"
        }
    };
    
  const settings = {
    isOpen: false,
    general: {
      primaryColor: '#6b4f3a',
      secondaryColor: '#c89b5a',
      fontFamily: 'Arial, sans-serif',
      embedded: false,
    },
    audio: {
      disabled: false,
    },
    chatHistory: {
        disabled: true
    },
    header: {
      title: 'Music Chat',
      showAvatar: false,
    },
    footer: {
      text: '2026.Music',
    },
    fileAttachment: {
        disabled: false,
        multiple: false
    },
    chatWindow: {
    showScrollbar: true,
    autoJumpToBottom: true
    }
    // other sections
  };

  const wrapStyles = {
    wordBreak: 'break-word', // Breaks words at arbitrary points if needed
    whiteSpace: 'pre-wrap', // Preserves line breaks and wraps text naturally
    overflowWrap: 'anywhere', // Ensures unbroken strings wrap safely
    maxWidth: '100%', // Keeps the bubble constrained to its container
  };

  const myStyles = {
    botBubbleStyle: { ...wrapStyles },
    userBubbleStyle: { ...wrapStyles },
  };

  return <ChatBot settings={settings} flow={flow} styles={myStyles} />;
};

export default MyChatBot;
