import { BackgroundId } from "@/features/sidebar/types/theme";

import Symbol from "./variants/symbol";
import Stain from "./variants/stain";
import Waves from "./variants/waves";

interface BackgroundProps {
  variants?: BackgroundId;
}

export default function Background({ variants }: BackgroundProps) {
  if (variants === "stain") return <Stain />;
  if (variants === "waves") return <Waves />;
  return <Symbol />;
}
