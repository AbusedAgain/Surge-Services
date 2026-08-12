export const useStyleProperty = (property: string) => {
    let element = document.documentElement;
    let declaration: CSSStyleDeclaration = getComputedStyle(element);
    let value = declaration.getPropertyValue(`--${property}`);

    const setValue = (value: any) => {
        element.style.setProperty(`--${property}`, value);
    }

    return [value, setValue];
};
