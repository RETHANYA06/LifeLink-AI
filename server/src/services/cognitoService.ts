import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    AuthFlowType,
    ConfirmSignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";

const region = process.env.AWS_REGION || 'us-east-1';
const clientId = process.env.COGNITO_CLIENT_ID || '';

const client = new CognitoIdentityProviderClient({ region });

export const signUp = async (email: string, password: string, name: string) => {
    const command = new SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'name', Value: name }
        ]
    });

    return await client.send(command);
};

export const signIn = async (email: string, password: string) => {
    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: clientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    });

    const response = await client.send(command);
    return response.AuthenticationResult;
};

export const confirmSignUp = async (email: string, code: string) => {
    const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: code
    });

    return await client.send(command);
};
