declare type FirestoreUser = {
    owner: string;
    preferences: UserPreferences;
}

declare type UserPreferences = {
    theme: colorTheme;
}