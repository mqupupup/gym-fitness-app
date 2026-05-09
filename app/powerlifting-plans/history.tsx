import { FlatList, Text, View } from "react-native";
import { useTrainingLog } from "../../src/hooks/useTrainingLog";

export default function TrainingHistory() {
  const { logs } = useTrainingLog();

  return (
    <FlatList
      data={logs}
      renderItem={({ item }) => (
        <View>
          <Text>
            {item.date} - {item.exercise}
          </Text>
          <Text>
            {item.weight}kg × {item.reps} ({item.notes})
          </Text>
        </View>
      )}
    />
  );
}
