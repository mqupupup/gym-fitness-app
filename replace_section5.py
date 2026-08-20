# -*- coding: utf-8 -*-
"""替换 AnalysisModal 中 Section 5 骨骼关键帧为证据帧组件"""

path = r'D:\code1\exercise\gym-fitness-app\src\exercises\components\AnalysisModal\index.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '            {/* ============ Section 5: 骨骼关键帧 ============ */}'
end_marker = '            {/* ============ Section 6: 轨迹与稳定性 ============ */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

assert start_idx != -1 and end_idx != -1, f"Markers not found: {start_idx}, {end_idx}"

new_section = '''            {/* ============ Section 5: AI 分析证据 ============ */}
            {keyFrames.length > 0 && (
              <View style={styles.analysisSection}>
                <Text style={styles.sectionTitle}>🔍 AI 分析证据</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.skeletonFramesRow}>
                    {keyFrames.map((kf: any, idx: number) => {
                      const imgW = 150;
                      const imgH = Math.round(
                        (imgW * kf.frame_height) / kf.frame_width
                      );
                      const scaleX = imgW / kf.frame_width;
                      const scaleY = imgH / kf.frame_height;

                      const boneColorMap: Record<string, string> = {
                        torso_top: "#66BB6A", torso_bottom: "#66BB6A",
                        torso_left: "#66BB6A", torso_right: "#66BB6A",
                        left_upper_arm: "#29B6F6", left_forearm: "#29B6F6",
                        right_upper_arm: "#EF5350", right_forearm: "#EF5350",
                        left_thigh: "#42A5F5", left_shin: "#42A5F5",
                        right_thigh: "#EC407A", right_shin: "#EC407A",
                      };

                      const eventLabel =
                        kf.type === "bottom" ? "最低点" : "锁定点";
                      const eventIcon = kf.type === "bottom" ? "⬇" : "⬆";

                      const metricKeys = Object.keys(kf.metrics || {});
                      const keyMetricKeys = metricKeys
                        .filter((k) =>
                          /elbow|torso|shoulder_flexion|knee|hip_hinge/.test(k)
                        )
                        .slice(0, 2);

                      const lowQualitySide =
                        kf.left_quality < 0.5 && kf.right_quality < 0.5
                          ? "both"
                          : kf.left_quality < 0.5
                          ? "left"
                          : kf.right_quality < 0.5
                          ? "right"
                          : null;

                      return (
                        <View key={`kf-${idx}`} style={styles.skeletonFrameCard}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 4,
                            }}
                          >
                            <Text style={[styles.skeletonFramePct, { fontSize: 12 }]}>
                              {eventIcon} {eventLabel}
                            </Text>
                            <Text style={{ fontSize: 9, color: "#999" }}>
                              Rep {kf.rep_index}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: imgW,
                              height: imgH,
                              borderRadius: 8,
                              overflow: "hidden",
                              backgroundColor: "#1a1a2e",
                              position: "relative",
                            }}
                          >
                            <Image
                              source={{ uri: kf.image_url }}
                              style={{
                                width: imgW,
                                height: imgH,
                                position: "absolute",
                                top: 0,
                                left: 0,
                              }}
                              resizeMode="cover"
                            />
                            <View
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: imgW,
                                height: imgH,
                                backgroundColor: "rgba(0,0,0,0.12)",
                              }}
                            />

                            {kf.bones.map((bone: any, bi: number) => {
                              const sx = bone.start[0] * scaleX;
                              const sy = bone.start[1] * scaleY;
                              const ex = bone.end[0] * scaleX;
                              const ey = bone.end[1] * scaleY;
                              const dx = ex - sx;
                              const dy = ey - sy;
                              const len = Math.max(
                                Math.sqrt(dx * dx + dy * dy),
                                1
                              );
                              const color =
                                boneColorMap[bone.name] || "#29B6F6";
                              const isLeft = bone.name?.startsWith("left_");
                              const isRight = bone.name?.startsWith("right_");
                              const dimmed =
                                (lowQualitySide === "left" && isLeft) ||
                                (lowQualitySide === "right" && isRight) ||
                                lowQualitySide === "both";
                              return (
                                <View
                                  key={`bone-${bi}`}
                                  style={{
                                    position: "absolute",
                                    left: sx,
                                    top: sy,
                                    width: len,
                                    height: 3,
                                    backgroundColor: color,
                                    borderRadius: 1.5,
                                    opacity: dimmed ? 0.2 : 0.9,
                                    transform: [
                                      { rotate: `${Math.atan2(dy, dx)}rad` },
                                    ],
                                  }}
                                />
                              );
                            })}

                            {kf.landmarks.map((lm: any, li: number) => {
                              const x = lm.position[0] * scaleX;
                              const y = lm.position[1] * scaleY;
                              const isLeft = lm.name?.startsWith("left_");
                              const isRight = lm.name?.startsWith("right_");
                              const dimmed =
                                (lowQualitySide === "left" && isLeft) ||
                                (lowQualitySide === "right" && isRight) ||
                                lowQualitySide === "both";
                              return (
                                <View
                                  key={`lm-${li}`}
                                  style={{
                                    position: "absolute",
                                    left: x - 3,
                                    top: y - 3,
                                    width: 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: "#FFD54F",
                                    borderWidth: 1,
                                    borderColor: "rgba(0,0,0,0.5)",
                                    opacity: dimmed ? 0.2 : 1,
                                  }}
                                />
                              );
                            })}
                          </View>

                          {keyMetricKeys.map((mk: string, mi: number) => (
                            <Text key={`metric-${mi}`} style={styles.skeletonAngleText}>
                              {ANGLE_NAME_ZH[mk] || mk}: {safeFixed(kf.metrics[mk])}°
                            </Text>
                          ))}

                          {kf.evidence_for && kf.evidence_for.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 3,
                                marginTop: 3,
                              }}
                            >
                              {kf.evidence_for
                                .slice(0, 2)
                                .map((ev: any, ei: number) => {
                                  const sevColor =
                                    ev.severity === "severe"
                                      ? "#EF5350"
                                      : ev.severity === "moderate"
                                      ? "#FF9800"
                                      : ev.severity === "mild"
                                      ? "#FFC107"
                                      : "#999";
                                  return (
                                    <View
                                      key={`ev-${ei}`}
                                      style={{
                                        backgroundColor: `${sevColor}22`,
                                        paddingHorizontal: 4,
                                        paddingVertical: 1,
                                        borderRadius: 3,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 8,
                                          color: sevColor,
                                          fontWeight: "600",
                                        }}
                                      >
                                        {ev.name}
                                      </Text>
                                    </View>
                                  );
                                })}
                            </View>
                          )}

                          {lowQualitySide && (
                            <Text style={{ fontSize: 8, color: "#FF9800", marginTop: 2 }}>
                              ⚠️ {lowQualitySide === "both"
                                ? "关键点缺失较多"
                                : lowQualitySide === "left"
                                ? "左侧识别质量低"
                                : "右侧识别质量低"}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

'''

content = content[:start_idx] + new_section + content[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("OK: Section 5 replaced with evidence frames")
