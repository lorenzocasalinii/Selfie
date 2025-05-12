import axios from 'axios';

const messageService = {
    getMessages: async (userID) => {
      try {
        const response = await axios.get(`/api/messages/${userID}`);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Error fetching messages"
        );
      }
    },
  
    sendMessage: async (payload) => {
      try {
        const response = await axios.post('/api/messages', payload);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Error sending message"
        );
      }
    },
  
    deleteMessage: async (id) => {
        try {
          const response = await axios.delete(`/api/messages/${id}`);
          return response.data;
        } catch (error) {
          throw new Error(error.response?.data?.message || "Error deleting message");
        }
      },
      
      completeMessage: async (id) => {
        try {
          const response = await axios.patch(`/api/messages/${id}`, { completed: true });
          return response.data;
        } catch (error) {
          throw new Error(error.response?.data?.message || "Error completing message");
        }
      },
      
  };
  
  export default messageService;
  