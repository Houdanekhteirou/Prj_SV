const FullContainer = ({ children, className }: { children: any; className?: string }) => (
  <main className={`px-12 py-6   ${className ? className : ''}`}>{children}</main>
)

export default FullContainer
