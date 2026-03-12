export const metadata = {
  title: "Nova AI Stylist",
  description: "AI powered fashion stylist"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}