'use client'
import {useState} from 'react';
import ActionDisplay from "@/app/components/ActionDisplay";
import {qAgent} from "@/app/qAgent";

export default function Home() {

    const [humanWins, setHumanWins] = useState(0)
    const [aiWins, setAiWins] = useState(0)
    const [draws, setDraws] = useState(0)
    const [rounds, setRounds] = useState(0)
    const [aiAction, setAIAction] = useState<number>(0)
    const [agent, setAgent] = useState(qAgent({hyperParams: {
        random: false
        }}))
    const [actions, setActions] = useState<number[]>([])

    const calculateWin = (action: number, aiAction: number) => {
        if (action === 0 && aiAction === 2) {
            return true
        }

        if (action === 1 && aiAction === 0) {
            return true
        }

        if (action === 2 && aiAction === 1) {
            return true
        }
        return false
    }
    const chooseAction = (action: number) => {

        const agentAction = agent.getAction(actions)
        const newActions = [...actions, action, agentAction]

        const humanWin = calculateWin(action, agentAction)
        const aiWin = calculateWin(agentAction, action)
        const isDraw = !aiWin && !humanWin

        const reward = aiWin ? 1 : isDraw ? 0.1 : 0
        console.log(`${agentAction} ${action} ${reward}`)

        agent.update(actions, newActions, agentAction, reward)

        setRounds(rounds + 1)
        setHumanWins(humanWins + (humanWin ? 1 : 0))
        setAiWins(aiWins + (aiWin ? 1 : 0))
        setDraws(draws + (isDraw ? 1 : 0))

        setActions(newActions)
        setAIAction(agentAction)

        console.log(agent.state())
    }

    return (
        <main className="flex min-h-screen flex-col font-bold items-center p-24 gap-5">
            <h1 className='text-3xl text-blue-600'>Win against the AI</h1>
            <h2>choose your next action:</h2>
            <div className="flex flex-row items-center justify-center gap-3">
                <button
                    className="p-4 hover:bg-blue-50 rounded-lg drop-shadow transition ease-in-out duration-300 text-3xl"
                    onClick={() => chooseAction(0)}>
                    <ActionDisplay action={0}></ActionDisplay>
                </button>
                <button
                    className="p-4 hover:bg-blue-50 rounded-lg drop-shadow transition ease-in-out duration-300 text-3xl"
                    onClick={() => chooseAction(1)}>
                    <ActionDisplay action={1}></ActionDisplay>
                </button>
                <button
                    className="p-4 hover:bg-blue-50 rounded-lg drop-shadow transition ease-in-out duration-300 text-3xl"
                    onClick={() => chooseAction(2)}>
                    <ActionDisplay action={2}></ActionDisplay>
                </button>
            </div>
            {aiAction !== null &&
                <div>
                    AI did choose:
                    <ActionDisplay action={aiAction}></ActionDisplay>
                </div>
            }
            <div>
                <p>Rounds: {rounds}</p>
                <p>Wins: {humanWins}</p>
                <p>Lose: {aiWins}</p>
                <p>Draws: {draws}</p>
            </div>
        </main>
    )
}
