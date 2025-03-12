'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Certificate {
    recipient: string;
    course: string;
    issuedDate: string;
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<p className="text-center">Loading...</p>}>
            <CertificateVerification />
        </Suspense>
    );
}

function CertificateVerification() {
    const searchParams = useSearchParams();
    const certId = searchParams.get('certId');
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!certId) {
            setError('Invalid access. Certificate ID is required.');
            setLoading(false);
            return;
        }

        async function fetchCertificate() {
            try {
                const res = await fetch(`/api/certificate/verify?certId=${certId}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Failed to fetch certificate details.');
                } else {
                    setCertificate(data);
                }
            } catch (error) {
                console.error('Error fetching certificate:', error);
                setError('Failed to fetch certificate details.');
            } finally {
                setLoading(false);
            }
        }

        fetchCertificate();
    }, [certId]);

    if (loading) {
        return <p className="text-gray-500 text-center">Verifying certificate...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!certificate) {
        return null;
    }

    return (
        <div className="p-6 text-center border border-gray-300 rounded-md shadow-md">
            <h1 className="text-2xl font-bold text-blue-700">Certificate Verification</h1>
            <p className="text-green-600 mt-2">✅ Certificate is valid</p>
            <div className="mt-4 space-y-2">
                <p>
                    <strong>Recipient:</strong> {certificate.recipient}
                </p>
                <p>
                    <strong>Course:</strong> {certificate.course}
                </p>
                <p>
                    <strong>Issued Date:</strong>{' '}
                    {new Date(certificate.issuedDate).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}
