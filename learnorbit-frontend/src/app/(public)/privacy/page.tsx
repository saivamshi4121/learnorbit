import StaticPage from "@/components/layout/StaticPage";

export const metadata = {
    title: "Privacy Policy | LearnOrbit",
    description: "How we protect and manage your data.",
};

export default function PrivacyPage() {
    return (
        <StaticPage 
            title="Privacy Policy"
            description="Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information."
        />
    );
}
