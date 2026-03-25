import {type ReactNode} from "react";

interface GradientScrollProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement>{
  // Width of the gradient on each side.
  gradWidth: string; // Any valid CSS width string (e.g., rem, em, px, %, calc()).

  // Color at the start of the gradient. Default: transparent
  startColor?: string; // Any valid CSS color string (e.g., hex, rgb(), rgba())

  // Color at the end of the gradient. Default: Bootstrap body color
  endColor?: string; // Any valid CSS color string (e.g., hex, rgb(), rgba())
}

export default function GradientScroll(props: GradientScrollProps): ReactNode{
  const gradColors: string = 
    // Set startColor or default transparent rgba(0, 0, 0, 0) if unset
    (props.startColor ? props.startColor : "rgba(0, 0, 0, 0)") + " 0%, " +
    // Set endColor or default Bootstrap body color var(--bs-body-bg) if unset
    (props.endColor ? props.endColor : "var(--bs-body-bg)") + " 100%)"

  return(
    <div style={props.style}
      className={"gradient-scroll position-relative" + 
        (props.className ? " " + props.className : "")
      }
    >
      <div className="gs-before position-absolute h-100"
        style={{width: props.gradWidth,
          backgroundImage: "linear-gradient(to left, " + gradColors
        } as React.CSSProperties}
      />
      {props.children}
      <div className="gs-after position-absolute h-100 top-0 end-0"
        style={{width: props.gradWidth, 
          backgroundImage: "linear-gradient(to right, " + gradColors
        } as React.CSSProperties}
      />
    </div>
  );
}