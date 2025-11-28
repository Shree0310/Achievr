import Container from "../Container";
import Heading from "../Heading";
import SubHeading from "../SubHeading";
import Card, { CardContent, CardCTA, CardSkeleton, CardTitle } from "./Card";
import { IconPlus } from '@tabler/icons-react';
import { SkeletonOne } from "./Skeletons/first";
import SkeletonThree from "./Skeletons/third";
import SkeletonTwo from "./Skeletons/second";

const Features = () => {
    return <Container className="mt-48 md:pt-4">
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
                <Card className="rounded-tl-3xl rounded-bl-3xl">
                    <CardSkeleton>
                        <SkeletonOne/>
                    </CardSkeleton>
                    <CardContent>
                        <CardTitle className="flex justify-between gap-1">
                            Developer first app with, clear ownership & progress transparency
                            <CardCTA>
                                <IconPlus stroke={2} />
                            </CardCTA>
                        </CardTitle>
                    </CardContent>
                </Card>
                <Card className="">
                    <CardSkeleton>
                        <SkeletonTwo/>
                    </CardSkeleton>
                    <CardContent>
                        <CardTitle className="flex justify-between gap-1">
                            Entire Worflow at one place
                            <CardCTA>
                                <IconPlus stroke={2} />
                            </CardCTA>
                        </CardTitle>
                    </CardContent>
                </Card>
                <Card className="rounded-tr-3xl rounded-br-3xl">
                    <CardSkeleton>
                        <SkeletonThree/>
                    </CardSkeleton>
                    <CardContent>
                        <CardTitle className="flex justify-between gap-1">
                            Never loose track with real time updates
                            <CardCTA>
                                <IconPlus stroke={2} />
                            </CardCTA>
                        </CardTitle>
                    </CardContent>
                </Card>
            </div>
    </Container>
}
export default Features;
