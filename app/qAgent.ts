export type HyperParams = {
    random: boolean
    memory?: number
    initial_epsilon?: number
    epsilon_decay?: number
    final_epsilon?: number
    gamma?: number
    learningRate?: number
}
export const qAgent = ({hyperParams}: { hyperParams?: HyperParams }) => {
    const qtable: any = {}
    // state = last two games
    // actions:
    // * rock = 0
    // * paper = 1
    // * scissor = 2
    const chp = {
        random: false,
        memory: 4,
        initial_epsilon: 1,
        epsilon_decay: 0.01,
        final_epsilon: 0.1,
        gamma: 0.8,
        learningRate: 0.01,
        ...hyperParams
    }


    let epsilon = chp.initial_epsilon;

    const concreteState = (state: number[]) => {
        state = state.slice(-chp.memory)
        return state.join('-')
    }

    const getAction = (state: number[]) => {
        const actions = getActions(state);

        if (Math.random() > epsilon && actions && !chp.random) {
            const bestActionValue = Math.max(...actions);
            if (bestActionValue >= 0) {
                return actions.indexOf(bestActionValue)
            }
        }
        console.log('did random')
        return Math.round(Math.random() * 2)
    }

    const getActions = (state: number[]) => {
        const cState = concreteState(state)
        const actions = qtable[cState]
        //initialize state if not set
        if (actions === null || actions === undefined) {
            qtable[cState] = [0, 0, 0]
            return [0, 0, 0]
        }
        return actions
    }

    const updateAction = (state: number[], action: number, value: number) => {
        const cState = concreteState(state)
        qtable[cState][action] = value;
    }

    const fuckWithJsFloatFuck = (value: number) => {
        return (Math.floor((value) * 1000000)) / 1000000
    }

    const update = (old_state: number[], nextState: number[], action: number, reward: number) => {

        const oldActions = getActions(old_state);

        const nextActions = getActions(nextState);

        const oldValue = oldActions[action]
        const nextValue = Math.max(...nextActions)

        updateAction(old_state, action, fuckWithJsFloatFuck(oldValue + chp.learningRate * (reward + chp.gamma * nextValue - oldValue)))
        // updateAction(old_state, action, oldValue + chp.learningRate * reward)
        console.log(`old:  ${concreteState(old_state)}/${fuckWithJsFloatFuck(oldValue + chp.learningRate * (reward + chp.gamma * nextValue - oldValue))}  new: ${concreteState(nextState)}/${nextValue}`)
        decreaseEpsilon()
    }

    const decreaseEpsilon = () => {
        if (epsilon > chp.final_epsilon) {
            epsilon = epsilon - chp.epsilon_decay
        } else {
            epsilon = chp.final_epsilon
        }
    }

    const state = () => {
        return qtable
    }

    return {getAction, update, state}
}