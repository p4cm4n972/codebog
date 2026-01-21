import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
    usePathname: () => '/',
    useParams: () => ({}),
}));

// Mock next/image
vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: { src: string; alt: string }) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    },
}));

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT', 'https://test.appwrite.io/v1');
vi.stubEnv('NEXT_PUBLIC_APPWRITE_PROJECT_ID', 'test-project');
vi.stubEnv('NEXT_PUBLIC_APPWRITE_DATABASE_ID', 'test-db');
