// components/ImageClassifier.tsx
import { useEffect, useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';

type Prediction = {
  className: string;
  probability: number;
};

const ImageClassifier: React.FC = () => {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [imageURL, setImageURL] = useState<string>('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const mobilenetModel = await mobilenet.load();
      setModel(mobilenetModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async () => {
    if (model && imageURL) {
      setLoading(true);
      const img = document.getElementById('uploaded-image') as HTMLImageElement;
      const predictions = await model.classify(img);
      setPrediction(predictions[0]);
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f5f5f5',
        padding: '20px'
      }}
    >
      <Typography variant="h4" color="primary" gutterBottom>
        Image Classifier
      </Typography>

      <Card sx={{ 
          minWidth: '300px',
          maxWidth: 400,
          p: 2
      }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button
              variant="contained"
              component="label"
              sx={{ mb: 2 }}
              color="primary"
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>

            {imageURL && (
              <Box
                component="img"
                id="uploaded-image"
                src={imageURL}
                alt="Uploaded"
                sx={{ 
                  maxHeight: '300px',
                  width: 'auto',
                  mb: 2
                }}
              />
            )}

            <Button
              variant="contained"
              color="secondary"
              disabled={!imageURL || loading}
              onClick={classifyImage}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Classify Image'}
            </Button>

            {prediction && (
              <Box mt={2} textAlign="center">
                <Typography variant="h6">
                  Prediction: {capitalizeFirstLetter(prediction.className)}
                </Typography>
                <Typography variant="body2">
                  Confidence: {(prediction.probability * 100).toFixed(2)}%
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImageClassifier;
