export interface routerType {
    title: string,
    path: string,
    element: JSX.Element;
    roles? : string[];
    protected?: boolean;
}