'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { switchChain } from "@wagmi/core";
import { config } from "@/wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { Stack, Button, Typography, Container } from "@mui/material";

function App() {
    const account = useAccount();
    const { connectors, connect, status, error } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance, refetch: refetchBalance } = useBalance({
        address: account.address,
    });

    const switchHandler = async () => {
        try {
            const result = await switchChain(config, {
                chainId: account.chainId !== 1 ? mainnet.id : sepolia.id,
            });
            await refetchBalance();
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle error appropriately, e.g., show error message to the user
        }
    };

    return (
        <Container maxWidth="sm" sx={{ background: '#ffffff', borderRadius: 4, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}> {/* Добавляем фон и тень */}
            <Stack spacing={2} sx={{ my: 4 }}> {/* Using Material-UI Stack for spacing and margin */}
                {account.status === 'connected' ? (
                    <>
                        <Typography variant="h6">Status: {account.status}</Typography> {/* Using Material-UI Typography */}
                        <Typography variant="h6">Account: {account.address}</Typography>

                        <Typography variant="h6">Balance: {balance && `${Number(balance?.formatted).toFixed(4)} ${balance?.symbol}`}</Typography>
                        <Stack direction="row" spacing={2}> {/* Using Stack component for layout */}
                            <Button onClick={switchHandler} variant="contained">
                                Switch to {account.chainId !== 1 ? "mainnet" : "sepolia"}
                            </Button>
                            <Button onClick={() => disconnect()} variant="contained" color="secondary">
                                Disconnect
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <>
                        <Typography variant="h6">Please choose a connect option</Typography>
                        <Typography variant="h6">{status}</Typography>
                        <Typography variant="h6">{error?.message}</Typography>
                        <Stack direction="row" justifyContent="center" spacing={2}> {/* Using Stack component for layout */}
                            {connectors.map((connector) => (
                                <Button
                                    key={connector.uid}
                                    onClick={() => connect({connector})}
                                    variant="contained"
                                >
                                    {connector.name}
                                </Button>
                            ))}
                        </Stack>
                    </>
                )}
            </Stack>
        </Container>
    );
}

export default App;
