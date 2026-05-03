Redesign the "Conversation" screen of the V-Sign AI application.

V-Sign AI is a real-time translation tool that supports two-way communication between spoken Vietnamese and Vietnamese Sign Language.

The conversation interface must clearly support two translation directions:

Speech/Text → Sign Language

Sign Language → Text/Voice

The UI should feel like a live communication interface rather than a form.

MAIN LAYOUT STRUCTURE

Create a split-screen conversation interface with two main panels.

LEFT PANEL – Speech/Text Input
Purpose: Allow hearing users to speak or type.

Components:

Large microphone button in the center

Text transcription area showing recognized speech

Text input field for manual typing

Button: "Translate to Sign Language"

Below the translation result:

Display animated sign language avatar OR sign language visual output

States:

Idle

Listening

Processing

Showing sign animation

RIGHT PANEL – Sign Language Input

Purpose: Allow deaf users to communicate using sign language.

Components:

Camera section

Large camera preview area

Button to activate camera

Label: "Detect Sign Language"

Detection output
Below the camera preview show:

Detected text from sign language

Button: "Play Voice" to convert text to speech

Edit option

User can edit detected text before voice playback

States:

Camera off

Camera active

Detecting signs

Processing

Result shown

CONVERSATION HISTORY AREA

Below both panels add a scrolling conversation timeline.

Each message should show:

Speaker type (Voice user or Sign user)

Original input

Translated output

Replay button

This should visually look like a chat conversation.

QUICK PHRASES SECTION

Add a small section with commonly used phrases:

Examples:

Cảm ơn bạn

Xin lỗi

Tôi không hiểu

Nói chậm hơn được không?

Tôi cần giúp đỡ

When tapped:
Automatically generate sign animation or speech output.

CAMERA CONTROL

Add a visible camera button for sign detection.

The camera preview should:

occupy around 40–50% of the right panel

show a placeholder hand icon when inactive

show live gesture capture when active

UX IMPROVEMENTS

The interface must prioritize accessibility:

Large buttons

High contrast colors

Clear visual feedback

Real-time status indicators

Add visual states for:

Listening

Detecting sign language

Processing AI translation

Result ready

VISUAL STYLE

Keep the existing V-Sign AI brand style:

Primary color: Blue
Accent color: Green
Background: Light gray / white

Rounded cards and soft shadows.

OUTPUT REQUIREMENTS

Generate a modern UI layout suitable for:

desktop web

tablet

The design should clearly communicate real-time two-way translation between spoken language and sign language.

Make the camera detection feature highly visible.