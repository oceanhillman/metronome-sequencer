import AccountManager from './AccountManager';

export default function PremiumPage() {
    return (
        <div className="flex min-h-screen flex-col items-center mt-12">
            <h1 className="text-center mb-4 text-cultured">Account Details</h1>
            <AccountManager />
        </div>
    );
}
