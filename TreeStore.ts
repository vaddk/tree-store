interface ItemTree {
    id: number | string
    parent: number | string
    type: string | null
    children?: ItemTree[]
}

interface TreeStoreStructure {
    getAll(): ItemTree[]
    getItem(id: number | string): ItemTree | undefined
    getChildren(id: number | string): ItemTree[] | []
    getAllChildren(id: number | string): ItemTree[] | []
    getAllParents(id: number | string): ItemTree[] | []
}
  
class TreeStore implements TreeStoreStructure {
    private data: ItemTree[]
    private extendedData: ItemTree[]

    constructor(data: any) {
        if (!Array.isArray(data)) throw new Error('[TreeStore] the first argument of the constructor can only be an array')
        this.data = data

        // Copy initial array and sort
        const sorted = this.data.slice().sort((a, b) => +a.id - +b.id)

        // Add children elements to parents
        for (const item of sorted) {
            if (item.id !== item.parent) {
                const parent = sorted[+item.parent - 1]

                if (!parent) continue
                if (!Array.isArray(parent.children)) parent.children = []

                parent.children.push(item)
            }
        }

        this.extendedData = sorted
    }

    private _isIndexEqId(id: number | string) {
        return this.extendedData[+id - 1]?.id === id
    }

    public getAll() {
        return this.data
    }

    public getItem(id: number | string) {
        if (this._isIndexEqId(id)) return this.extendedData[+id - 1]
        // If index not equal id
        return this.data.find((item) => item.id === id)
    }

    public getChildren(id: number | string) {
        if (this._isIndexEqId(id)) return this.extendedData[+id - 1].children ?? []
        // If index not equal id
        return this.data.find((item) => item.id === id)?.children ?? []
    }

    public getAllChildren(id: number | string) {
        let children = this.getChildren(id)
        for (const item of children) {
            const child: ItemTree[] | [] = this.getChildren(item.id)
            if (child.length !== 0) children = children.concat(child)
        }
        return children
    }

    public getAllParents(id: number | string): ItemTree[] | []  {
        let result = []
        const el = this.extendedData[+id - 1]
        if (!el) return []
        const item = this.getItem(el.parent)
        if (!item) return []
        result.push(item)
        if (item.parent) result = result.concat(this.getAllParents(item.id))
        return result
    }
}

const items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },
    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },
    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
]
const ts = new TreeStore(items)
console.log(ts.getAllParents(8))