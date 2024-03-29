import patientUser from '../models/patientUser.js';
const createUser = async (req, res) => {
    const { username, password, patientIds } = req.body;
  
    try {
      const newUser = await patientUser.create({ username, password, patientIds });
      res.status(200).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const getUser = async (req, res) => {
    const { username } = req.params; // Assuming username is passed as a route parameter
    
    try {
        const user = await patientUser.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {createUser, getUser};
