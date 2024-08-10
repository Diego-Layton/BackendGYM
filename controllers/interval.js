import Interval from "../models/interval.js"



const httpInterval = {

    getInterval: async (req, res) => {
        const interval = await Interval.find()
        res.json({interval})
    },

}
export default httpInterval