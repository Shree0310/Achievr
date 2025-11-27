import Container from "../Container";
import Heading from "../Heading";
import SubHeading from "../SubHeading";
import Card, { CardContent, CardTitle } from "./Card";

const Features = () => {
    return <Container className="mt-36 md:pt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-6xl mx-auto">
            <div className="flex-1 min-w-0">
                <Heading className="max-w-2xl">
                    For fast growing product teams
                </Heading>
            </div>
            <div className="flex-1 min-w-0">
                <SubHeading>
                    Achievr is designed around the habits that make great developers unstoppable: 
                    ruthless prioritization, momentum-driven execution, and tooling that connects 
                    your tasks directly to your code—no context-switching required.        
                </SubHeading>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
                <Card className="">
                    <CardContent>
                        <CardTitle>
                            Developer first app with, clear ownership & progress transparency
                        </CardTitle>
                    </CardContent>
                </Card>
                <Card className="">
                    <CardContent>
                        <CardTitle>
                            Entire Worflow at one place
                        </CardTitle>
                    </CardContent>
                </Card>
                <Card className="">
                    <CardContent>
                        <CardTitle>
                            Never loose track with real time updates & branch tracking
                        </CardTitle>
                    </CardContent>
                </Card>
            </div>
    </Container>
}
export default Features;
