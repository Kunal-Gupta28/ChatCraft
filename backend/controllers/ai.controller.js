const {generateResult} = require('../services/ai.service')
const {setFileTree} = require("../services/project.service")

// getting result from AI 
module.exports.getResult = async (req,res) =>{
    try {
        const {projectId,prompt} = req.query;

        // passing prompt to AI
        const result = await generateResult(prompt);

        // if result contains file tree then save it in database
        if(result.fileTree){
            setFileTree({projectId,fileTree:result.fileTree})
        }

        return res.status(200).json({result});
    } catch (error) {
        return res.status(503).json({error:error.message})
    }

}