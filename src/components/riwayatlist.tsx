import { Link } from "expo-router";
import { Text, View } from "react-native";
import type { HasilGeocoding } from "../types/geocoding";

interface RiwayatListProps {
  daftarKota: HasilGeocoding[];
}

export default function RiwayatList({ daftarKota }: RiwayatListProps) {
  return (
    <View>
      {daftarKota.map((kota) => (
        <Link
          key={kota.id}
          href={{
            pathname: "/detail/[kota]" as any,
            params: { kota: kota.name },
          }}
        >
          <Text>
            {kota.name}
            {kota.admin1 ? `, ${kota.admin1}` : ""}
          </Text>
        </Link>
      ))}
      {daftarKota.length === 0 && <Text>Belum ada kota di riwayat pencarian.</Text>}
    </View>
  );
}
