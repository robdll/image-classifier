import { useEffect, useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

type Prediction = {
  className: string;
  probability: number;
};

const ImageClassifier: React.FC = () => {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [imageURL, setImageURL] = useState<string>('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);

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
      const img = document.getElementById('uploaded-image') as HTMLImageElement;
      const predictions = await model.classify(img);
      setPrediction(predictions[0]);
    }
  };

  return (
    <div>
      <h1>Image Classifier</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageURL && (
        <>
          <img id="uploaded-image" src={imageURL} alt="Uploaded" style={{ maxWidth: '300px' }} />
          <button onClick={classifyImage}>Classify Image</button>
        </>
      )}
      {prediction && (
        <div>
          <p>Prediction: {prediction.className}</p>
          <p>Confidence: {(prediction.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;
