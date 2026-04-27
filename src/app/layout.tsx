import "./globals.css";

export const metadata = {
  title: "CreativeClip",
  description: "SaaS premium para estilistas e costureiras com IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}