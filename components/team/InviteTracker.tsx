'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';
import { usePlatformState } from '@/lib/PlatformStateProvider';

export default function InviteTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { status } = useSession();
    const { user } = usePlatformState();


    useEffect(() => {
        const trackInvite = async () => {
            const storedInviteCode = Cookies.get('inviteRef');
            if (storedInviteCode?.length > 10) {
                return;
            }

            const inviteCode = searchParams.get('teamInvite');
            if (inviteCode?.length > 0) {
                Cookies.set('inviteRef', inviteCode);
            }
        };
        trackInvite();
    }, [pathname, searchParams]);


    const handleInvite = async (token) => {
        const findResponse = await fetch(`/api/team/lookup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token, email: user?.email })
        });
        if(findResponse.ok) {
            const memberData = await findResponse.json();
            if(memberData?.email?.length > 0) {
                if(memberData?.status === 'pending') {
                    const updatedMemberData = {
                        ...memberData,
                        name: user?.name,
                        status: 'active'
                    } 
                    const response = await fetch(`/api/team`, {
                        method: "PUT",
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({memberId: memberData._id, newMember: updatedMemberData})
                    });
                    if(response.ok) {
                        Cookies.set('inviteRef', null);
                    }
                }
            }
        }
    };


    useEffect(() => {
        if (user?.email?.length > 0) {
            const storedInviteCode = Cookies.get('inviteRef');
            if (storedInviteCode?.length > 10) {
                handleInvite(storedInviteCode);
                return
            } else {
                const inviteCode = searchParams.get('teamInvite');
                if (inviteCode?.length > 0) {
                    handleInvite(inviteCode);
                }
            }
        }
    }, [user, searchParams, status, pathname]);

    return null;
}