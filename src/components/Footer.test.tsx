import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
    it('should render copyright text', () => {
        render(<Footer />);
        // Footer has desktop and mobile versions, so use getAllBy
        const copyrightElements = screen.getAllByText(/CODEBOG/i);
        expect(copyrightElements.length).toBeGreaterThan(0);
    });

    it('should render legal links', () => {
        render(<Footer />);
        // Multiple links exist (desktop + mobile)
        const mentionsLinks = screen.getAllByText(/Mentions légales/i);
        const cguLinks = screen.getAllByText(/CGU/i);
        expect(mentionsLinks.length).toBeGreaterThan(0);
        expect(cguLinks.length).toBeGreaterThan(0);
    });

    it('should have correct link hrefs', () => {
        render(<Footer />);
        const mentionsLinks = screen.getAllByRole('link', { name: /mentions légales/i });
        const cguLinks = screen.getAllByRole('link', { name: /cgu/i });

        // Check at least one link has the correct href
        expect(mentionsLinks[0]).toHaveAttribute('href', '/mentions-legales');
        expect(cguLinks[0]).toHaveAttribute('href', '/cgu');
    });
});
