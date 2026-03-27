export function Button({ children, className = "", ...props }: any) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}