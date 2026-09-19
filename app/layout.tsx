import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

export const metadata: Metadata = {
metadataBase: new URL("https://pakutility.vercel.app"),

title: {
default: "PakUtility — Free Online Tools for Pakistan",
template: "%s | PakUtility",
},

description:
"PakUtility provides free online tools including prayer times, Qibla finder, Quran, weather, cryptocurrency rates and other useful everyday utilities for Pakistan.",

keywords: [
"PakUtility",
"Pakistan utilities",
"free online tools",
"Pakistan tools",
"prayer times Pakistan",
"Qibla finder",
"Quran online",
"Pakistan weather",
"crypto rates",
"daily utility tools",
],

authors: [
{
name: "PakUtility",
},
],

creator: "PakUtility",
publisher: "PakUtility",

verification: {
google: "i-TdKmO9zKFcYNHSvNYucvY7FLTwi9FBCATMKt1r148",
},

alternates: {
canonical: "https://pakutility.vercel.app",
},

robots: {
index: true,
follow: true,
googleBot: {
index: true,
follow: true,
"max-image-preview": "large",
"max-snippet": -1,
"max-video-preview": -1,
},
},

openGraph: {
type: "website",
locale: "en_PK",
url: "https://pakutility.vercel.app",
siteName: "PakUtility",
title: "PakUtility — Free Online Tools for Pakistan",
description:
"Free online utilities for prayer times, Qibla, Quran, weather, crypto rates and more.",
},

twitter: {
card: "summary_large_image",
title: "PakUtility — Free Online Tools for Pakistan",
description:
"Free online utilities for prayer times, Qibla, Quran, weather, crypto rates and more.",
},
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html
lang="en"
className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
> <body className="min-h-full flex flex-col">{children}</body> </html>
);
}
