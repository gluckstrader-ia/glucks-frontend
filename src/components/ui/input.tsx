export function Input({ className = "", ...props }: any) {
  return (
    <input
      className={`h-10 px-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500/40 ${className}`}
      {...props}
    />
  );
}