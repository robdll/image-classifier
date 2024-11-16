import Head from "next/head";
import localFont from "next/font/local";
// import styles from "@/styles/Home.module.css";
import ImageClassifier from '@/components/ImageClassifier';
import { Box } from '@mui/material';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Image classifier</title>
        <meta name="description" content="Tensorflow AI project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ImageClassifier />
    </>
  );
}
