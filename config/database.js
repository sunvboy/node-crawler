const mongoose = require('mongoose');
//connect mongoose
const databaseConfig = {
    username: 'tool_crawler',
    password: 'Mimo2804',
    database: 'tool_crawler',
}
const mongoDBConnect = () => {
    mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.tmgma7x.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`)
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connect error: '));
    db.once('open', () => {
        console.log('Database connected')
    })
}
module.exports = mongoDBConnect;