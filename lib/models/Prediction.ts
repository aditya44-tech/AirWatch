import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
    city: string;
    predictions: { hour: number; aqi: number; label: string }[];
    generatedAt: Date;
}

const PredictionSchema = new Schema<IPrediction>({
    city: { type: String, required: true, index: true },
    predictions: [
        {
            hour: Number,
            aqi: Number,
            label: String,
        },
    ],
    generatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Prediction ||
    mongoose.model<IPrediction>('Prediction', PredictionSchema);
