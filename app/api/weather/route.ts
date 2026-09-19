import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const units = searchParams.get("units") || "metric";

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OpenWeather API key is missing.",
        },
        { status: 500 }
      );
    }

    if (!lat || !lon) {
      return NextResponse.json(
        {
          error: "Latitude and longitude are required.",
        },
        { status: 400 }
      );
    }

    const url =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&units=${units}` +
      `&appid=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.message || "Weather API request failed.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather API error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch weather data.",
      },
      { status: 500 }
    );
  }
}