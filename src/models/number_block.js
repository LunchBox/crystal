import Block from './block.js'

export default class NumberBlock extends Block {
	constructor() {
		super()
		this.title = 'Number'
		this.args = []
		this.outputs = [0]
	}
}