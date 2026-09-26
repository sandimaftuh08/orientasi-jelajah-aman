import { Link } from "expo-router";
import { Text, View } from "react-native";

interface RiwayatListProps {
  daftarKota: string[];
}

export default function RiwayatList({ daftarKota }: RiwayatListProps) {
  return (
    <View>
      {daftarKota.map((kota) => (
        <Link
          key={kota}
          href={{
            pathname: "/detail/[kota]" as any,
            params: { kota },
          }}
        >
          <Text>{kota}</Text>
        </Link>
      ))}
    </View>
  );
}