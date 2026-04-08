export type Alarm = {
    id: string;
    hour: number; //0-23 
    minute: number; // 0-59
    repeatDays: number[]; //[0,1,2,3,4] = Mon-Fri, [] = no repeat
    label: string; // "wake up", "gym", etc
    enabled: boolean; //the toggle switch state
    stage2DelayMinutes: number; //1-60, from the slider
    photoVerificationOn: boolean; // always true for now, but flexible
};