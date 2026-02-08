import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ALGOBOG - CodeBog',
  description: 'Algorithmic problem solving in the urban jungle. 2500 problems across 6 districts.',
};

export default function AlgobogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
