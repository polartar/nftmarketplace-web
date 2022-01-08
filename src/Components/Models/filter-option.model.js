export class FilterOption {
    type = 'collection';
    address = null;
    name = 'All';

    get getOptionLabel() {
        return this.name;
    }

    get getOptionValue() {
        return this.address;
    }

    static fromJson({ address, name }) {
        const filterOption = new FilterOption();

        filterOption.address = address;
        filterOption.name = name;

        return filterOption;
    }

    static default() {
        return new FilterOption();
    }

    toApi() {
        if (!this.address || !this.type) {
            return {}
        }

        return {
            [this.type]: this.address.toLowerCase()
        };
    }

}
