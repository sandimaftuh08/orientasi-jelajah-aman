// components/WeatherCard.tsx 
import { View, Text } from "react-native"; 
import { WeatherCardProps } from "../types/cuaca"; 
export default function WeatherCard({ kota, suhu, tingkatAQI }: WeatherCardProps) {  const warnaAQI = tingkatAQI === "BAIK" ? "green" : "orange"; 
 return ( 
 <View style={{ padding: 16, borderRadius: 8, backgroundColor: "#F4F7FA" }}>  <Text style={{ fontWeight: "bold", fontSize: 18 }}>{kota}</Text>  <Text style={{ fontSize: 32 }}>{suhu}°C</Text> 
 <Text style={{ color: warnaAQI }}>AQI: {tingkatAQI}</Text> 
 </View> 
 ); 
}
