"use client"

import ResetPassword from '@/components/home/ResetPassword';
import CustomToaster from '@/components/misc/CustomToaster';
import InviteTracker from '@/components/team/InviteTracker';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { PlatformStateProvider } from '@/lib/PlatformStateProvider';
import { RealtimeStateProvider } from '@/lib/RealtimeStateContext';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { ToastProvider } from '@/lib/toastContext';
import { U2uStateProvider } from '@/lib/U2ustatecontext';


const ProvidersWrapper = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    return (
        <ThemeProvider>
            <ToastProvider>
                <PlatformStateProvider>
                    <U2uStateProvider>
                        <RealtimeStateProvider>
                            <EdgeStoreProvider>
                                {children}
                                <CustomToaster />
                                <ResetPassword />
                                <InviteTracker />
                            </EdgeStoreProvider>
                        </RealtimeStateProvider>
                    </U2uStateProvider>
                </PlatformStateProvider>
            </ToastProvider>
        </ThemeProvider>
    )
}

export default ProvidersWrapper