import { BackgroundId } from "@/features/sidebar/types/theme";

import Symbol from "./variants/symbol";
import Stain from "./variants/stain";
import Waves from "./variants/waves";
import Halftone from "./variants/halftone";
import Paper from "./variants/paper";
import Topo from "./variants/topo";

interface BackgroundProps {
  variants?: BackgroundId;
}

export default function Background({ variants }: BackgroundProps) {
  if (variants === "stain") return <Stain />;
  if (variants === "waves") return <Waves />;
  if (variants === "halftone") return <Halftone />;
  if (variants === "paper") return <Paper />;
  if (variants === "topo") return <Topo />;
  return <Symbol />;
}
