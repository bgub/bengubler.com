const stripeColors = ["bg-peach", "bg-sage", "bg-lavender", "bg-buttercream"];

export function getStripeColorByIndex(index: number) {
  return stripeColors[index % stripeColors.length];
}
