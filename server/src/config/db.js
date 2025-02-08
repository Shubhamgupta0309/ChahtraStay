import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        if(connection) {
            console.log(`Connected to MongoDB! ${connection.connection.host}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
export default connectDB;