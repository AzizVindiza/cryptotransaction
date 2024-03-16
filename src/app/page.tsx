'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { switchChain } from "@wagmi/core";
import { config } from "@/wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { Stack, Button, Typography, Container } from "@mui/material";
import {SendTransaction} from "@/app/SendTransaction";

function App() {
    const account = useAccount();
    const { connectors, connect, status, error } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
        address: account.address,
        chainId: 1 // Ethereum chain ID
    });
    const { data: bnbBalance, refetch: refetchBnbBalance } = useBalance({
        address: account.address,
        chainId: 56 // Binance Smart Chain chain ID
    });

    const switchHandler = async () => {
        try {
            const result = await switchChain(config, {
                chainId: account.chainId !== 1 ? mainnet.id : sepolia.id,
            });
            await Promise.all([refetchEthBalance(), refetchBnbBalance()]);
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle error appropriately, e.g., show error message to the user
        }
    };

    return (
        <Container maxWidth="sm" sx={{ background: '#ffffff', borderRadius: 4, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Stack spacing={2} sx={{ my: 4 }}>
                {account.status === 'connected' ? (
                    <>
                        <Typography variant="h6">Status: {account.status}</Typography>
                        <Typography variant="h6">Account: {account.address}</Typography>
                        <Typography variant="h6">ETH Balance: {ethBalance && `${Number(ethBalance?.formatted).toFixed(4)} ${ethBalance?.symbol}`}</Typography>
                        <Typography variant="h6">BNB Balance: {bnbBalance && `${Number(bnbBalance?.formatted).toFixed(4)} ${bnbBalance?.symbol}`}</Typography>
                        <Typography variant="h6">ChainID: {account.chainId}</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button onClick={switchHandler} variant="contained">
                                Switch to {account.chainId !== 1 ? "mainnet" : "sepolia"}
                            </Button>
                            <Button onClick={() => disconnect()} variant="contained" color="secondary">
                                Disconnect
                            </Button>
                        </Stack>
                        <SendTransaction/>
                    </>
                ) : (
                    <>
                        <Typography variant="h6">Please choose a connect option</Typography>
                        <Typography variant="h6">{status}</Typography>
                        <Typography variant="h6">{error?.message}</Typography>
                        <Stack direction="row" justifyContent="center" spacing={2}>
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
