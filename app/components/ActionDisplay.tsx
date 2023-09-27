import {FunctionComponent} from "react";


const ActionDisplay: FunctionComponent<{action: number}> = ({action}) => {
    const actionToText = (index: number) => {
        switch (index) {
            case 0:
                return '🗿'
            case 1:
                return '🧻'
            case 2:
                return '✂'
            default:
                console.error('not specified')
        }
    }

    return <span>
        {actionToText(action)}
    </span>
}

export default ActionDisplay