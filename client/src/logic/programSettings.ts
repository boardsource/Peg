export class ProgramSettings {
    private static instance: ProgramSettings;

    seven: boolean = true
    tooltips: boolean = true;
    apiUrl: string = ""
    private constructor() {

    }

    public static getInstance(): ProgramSettings {
        if (!ProgramSettings.instance) {
            ProgramSettings.instance = new ProgramSettings();
        }
        return ProgramSettings.instance;
    }
}